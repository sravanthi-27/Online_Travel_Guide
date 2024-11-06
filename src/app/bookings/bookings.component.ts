import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class BookingsComponent {
  fullName: string = '';
  bookingDetails: any = null;
  remainingDays: number | null = null;

  async fetchBookingDetails() {
    try {
      const response = await axios.get('http://localhost:5300/api/bookings');
      const bookings = response.data;

      // Find booking details by full name
      this.bookingDetails = bookings.find(
        (booking: any) => booking.fullName === this.fullName
      );

      if (this.bookingDetails) {
        this.calculateRemainingDays();
      } else {
        alert('Booking not found!');
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  }

  calculateRemainingDays() {
    const checkinDate = new Date(this.bookingDetails.checkin);
    const today = new Date();
    const diffInMs = checkinDate.getTime() - today.getTime();
    this.remainingDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  }

  async deleteBooking() {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(
          `http://localhost:5300/api/bookings/${this.bookingDetails.fullName}`
        );
        alert('Booking cancelled successfully!');
        this.bookingDetails = null;
        this.remainingDays = null;
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
  }
}